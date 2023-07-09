import React from "react";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { Link, useParams } from "react-router-dom";

type Props = {
  title?: string;
  slug?: string;

};

const Breadcrumb: React.FC<Props> = ({ title }) => {
  const { category, name } = useParams();
  return (
    <nav className="flex py-3 px-5 " aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to={"/"} className="text-sm  inline-flex items-center">
            <AiFillHome />
            <p className="ml-3">Home</p>
          </Link>
        </li>

        <li>
          <div className="flex items-center">
            <MdOutlineArrowForwardIos />

            <Link to={category ? `/${category}` : "/manga"}>
              <p className="ml-3">
                {category
                  ? category.charAt(0).toUpperCase() + category.slice(1)
                  : "Manga"}
              </p>
            </Link>
          </div>
        </li>

        <li aria-current="page">
          <div className="flex items-center">
            {title && <MdOutlineArrowForwardIos />}
            <Link to={name ? `/manga/${name}` : "/"}>
              <span className="ml-1 md:ml-2 text-sm font-medium ">
                {title}
              </span>
            </Link>
          </div>
        </li>

        
      </ol>
    </nav>
  );
};

export default Breadcrumb;
