import * as express from 'express';
import fetch from 'node-fetch';
import { routeHelper, setAuthor } from './router-helper';
import { ProductListResponse } from '../entities/product-list-response.entity';
import { ProductPreview } from '../entities/product-preview.entity';
import { Response } from 'express';
import { ChallengeApiRequest } from '../entities/api-request.entity';
import { ProductDetailResponse } from '../entities/product-detail-response.entity';
import { ProductDetail } from '../entities/product-detail.entity';
import { ProductCategory } from '../entities/product-category.entity';

const productsRouter = express.Router();

productsRouter.use(express.json());
productsRouter.use(setAuthor);

productsRouter.get('/', routeHelper(async (req: ChallengeApiRequest, res: Response<ProductListResponse>) => {
    const query = req.query.q;
    const limit = req.query.limit || 4;
    const results = await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${query}&limit=${limit}`);
    const data = await results.json();

    let categories: string[] = [];

    // Busca la categoría de la propiedad filters para obtener su path.
    const filterCategory: any = data.filters.filter((availableFilter: any) => availableFilter.id === 'category')[0];
    if (filterCategory) {
        categories = filterCategory.values && filterCategory.values[0] && filterCategory.values[0].path_from_root ?
            filterCategory.values[0].path_from_root.map((categoryItem: ProductCategory) => categoryItem.name) : [];
    }

    // Busca la categoría con mayor cantidad de resultados y obtiene la información de la categoría.
    if (categories.length === 0) {
        const categoriesAvailable: any = data.available_filters.filter((availableFilter: any) => availableFilter.id === 'category')[0];
        const categoriesValues: ProductCategory[] = categoriesAvailable ? categoriesAvailable.values : []
        const mostSearchestCategory: ProductCategory = categoriesValues.reduce(
            (mostSearchestCategoryAcum: ProductCategory, categoryItem: ProductCategory) => {
                if (!mostSearchestCategoryAcum || categoryItem.results > mostSearchestCategoryAcum.results) {
                    return categoryItem;
                }
                return mostSearchestCategoryAcum;
            },
            null
        );
        if (mostSearchestCategory) {
            categories = await getCategoriesPath(mostSearchestCategory.id)
        }
    }

    const response: ProductListResponse = {
        author: req.author,
        categories,
        items: data.results.map(mapProcutsToProductPreview)
    };
    res.status(200).json(response);
}));

productsRouter.get('/:id', routeHelper(async (req: ChallengeApiRequest, res: Response<ProductDetailResponse>) => {
    const { id } = req.params;
    const result = await Promise.all([
        (async () => {
            const itemResponse = await fetch(`https://api.mercadolibre.com/items/${id}`);
            const itemData = await itemResponse.json();
            const categories = await getCategoriesPath(itemData.category_id);
            return {
                ...itemData,
                address: {
                    state_name: itemData.seller_address.state.name
                },
                categories
            };
        })(),
        (async () => {
            const descriptionResponse = await fetch(`https://api.mercadolibre.com/items/${id}/description`);
            const descriptionData = await descriptionResponse.json();
            return descriptionData;
        })()
    ]);

    const response: ProductDetailResponse = {
        author: req.author,
        categories: result[0].categories,
        item: mapProductByIdToProductDetail({ ...result[0], ...result[1] })
    };
    res.status(200).json(response);
}));

function mapProcutsToProductPreview(itemResult: any): ProductPreview {
    const ret: ProductPreview = {
        id: itemResult.id,
        title: itemResult.title,
        condition: itemResult.condition,
        free_shipping: itemResult.shipping.free_shipping,
        picture: itemResult.thumbnail,
        state_name: itemResult.address.state_name,
        price: {
            currency: itemResult.currency_id,
            amount: Math.floor(itemResult.price),
            decimals: Math.floor(Math.abs(itemResult.price - Math.floor(itemResult.price)) * 100)
        }
    };
    return ret;
}

function mapProductByIdToProductDetail(itemDetail: any): ProductDetail {
    const itemPreview: ProductPreview = mapProcutsToProductPreview(itemDetail);
    const ret: ProductDetail = {
        ...itemPreview,
        description: itemDetail.plain_text,
        sold_quantity: itemDetail.sold_quantity
    }
    return ret;
}

async function getCategoriesPath(categoryId: string): Promise<string[]> {
    const categories = await fetch(`https://api.mercadolibre.com/categories/${categoryId}`);
    const categoryResponse = await categories.json();
    const categoriesPath: string[] = categoryResponse.path_from_root.map((categoryItem: ProductCategory) => categoryItem.name)
    return categoriesPath;
}

export default productsRouter;
