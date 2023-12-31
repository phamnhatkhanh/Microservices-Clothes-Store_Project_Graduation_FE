import { useEffect, useState} from "react";
import { useQuery } from "@tanstack/react-query";
import getImages from "../../utilities/api/apiService";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { searchQuerySelector } from "../../store/slices/searchQuerySlice";
import Loader from "../Reusables/Loader";
import {
  generateTitle,
  randomCategory,
  randomTitle,
} from "../../utilities/RandomGenerators/generateTitle";
import generatePrice from "../../utilities/RandomGenerators/generatePrice";
import { Link } from "react-router-dom";
import { setProductItems } from "../../store/slices/productSlice";
import {
  paginationSelector,
  setPagination,
} from "../../store/slices/paginationSlice";
import { filterSelector, initialState } from "../../store/slices/filterSlice";
import { checkoutPriceSelector } from "../../store/slices/checkoutPriceSlice";
import toTitleCase from "../../utilities/SmallFunctions/titleCase";
import {getCollections,CollectionItem} from "../../utilities/api/apiService";

const SearchItems = () => {
  const dispatch = useAppDispatch();
  const pagination = useAppSelector(paginationSelector);
  const checkoutPrice = useAppSelector(checkoutPriceSelector);
  const freeShippingPrice = 75;
  const filters = useAppSelector(filterSelector);
  const searchQueryValue = useAppSelector(searchQuerySelector);
  const { category, price, shipping } = filters;

  useEffect(() => {
    window.scroll({ top: 0, behavior: "smooth" });
  }, [pagination]);

  // useEffect(() => {
  //   dispatch(setPagination(1));
  // }, [searchQueryValue, dispatch]);

  const perPage = 20;
  const orientation = "squarish";

  const [collections, setCollections] = useState<CollectionItem[]>([]);

useEffect(() => {
  getCollections().then((data) => {
    setCollections(data);
  });
}, []);
  

  // const searchQuery = useQuery({
  //   queryKey: ["product", searchQueryValue, perPage, orientation, pagination],
  //   queryFn: () =>
  //     getImages(searchQueryValue, perPage, orientation, pagination),
  //   refetchOnWindowFocus: false,
  //   retry: 2,
  //   staleTime: 300000,
  // });

  // if (searchQuery.isFetching) {
  //   return <Loader />;
  // }

  const validItem = (itemCategory: string, itemPrice: number) => {
    if (filters === initialState) return true;

    let isValidItem = true;

    if (category !== "") {
      if (category !== itemCategory) {
        isValidItem = false;
      }
    }

    if (price && price?.length > 0) {
      for (let i = 0; i < price.length; i++) {
        if (itemPrice > price[i]) {
          isValidItem = false;
          return;
        }
      }
    }

    if (shipping === "Free" && checkoutPrice < freeShippingPrice) {
      if (itemPrice < freeShippingPrice) {
        isValidItem = false;
      }
    }

    return isValidItem;
  };

  return (
    <>
      <section className="flex justify-center flex-wrap mt-5 gap-4">
      <a className="flex flex-col w-40 sm:w-52 md:w-60 xl:w-72 shadow-normal shadow-slate-300 dark:shadow-[#6b6b6bc4] dark:bg-slate-900" href="/products/Wool Runners?category=men"><div>
  
        <img
                      loading="lazy"
                      className="object-cover"
                      src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w0NzcwMTB8MHwxfHNlYXJjaHwxfHxzbmVha2VyfGVufDB8Mnx8fDE2OTgyMjg3MzV8MA&amp;ixlib=rb-4.0.3&amp;q=80&amp;w=1080"
                 
                    />
          </div><div className="p-2 pb-5"><p className="font-bold">Men's Wool Runners</p><p>$104</p></div></a>
        {collections? (
          collections.map((data) => {
            const category = randomCategory();
            const title = randomTitle();
            const price = generatePrice();
            if (validItem(toTitleCase(category), Number(price.slice(1)))) {
              return (
                <Link
                  to={`/products/${title}?category=${category}`}
                  key={data.id}
                  className="flex flex-col w-40 sm:w-52 md:w-60 xl:w-72 shadow-normal shadow-slate-300 dark:shadow-[#6b6b6bc4] dark:bg-slate-900"
                  onClick={() => {
                    dispatch(
                      setProductItems({
                        imgurl: "https://ae01.alicdn.com/kf/HTB1F02QKb5YBuNjSspoq6zeNFXaW.jpg",
                        product: searchQueryValue,
                        title: data.title,
                        price: price,
                      })
                    );
                  }}
                >
                  <div>
                    <img
                      loading="lazy"
                      className="object-cover"
                      src="https://ae01.alicdn.com/kf/HTB1F02QKb5YBuNjSspoq6zeNFXaW.jpg"
                      alt={data.title}
                    />
                  </div>
                  <div className="p-2 pb-5">
                    <p className="font-bold">
                      {generateTitle(category, data.title)}
                    </p>
                    <p>{price}</p>
                  </div>
                </Link>
              );
            }
          })
        ) : (
          <div className="text-red-500 text-xl uppercase">Not Found</div>
        )}
      </section>
    </>
  );
};

export default SearchItems;
