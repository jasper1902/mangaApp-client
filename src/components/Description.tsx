import { Link } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import { TbFileDescription } from "react-icons/tb";

type Props = {
  title: string;
  tagList?: string[];
  slug: string;
};

const Description = (props: Props) => {
  return (
    <div className="my-1 mx-auto gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 bg-accent rounded-t-md">
      {props.title && <Breadcrumb title={props.title} slug={props.slug} />}
      <div className="flex items-start rounded-b-md p-4 shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border ">
          <TbFileDescription />
        </div>

        <div className="ml-4">
          <h1 className="font-semibold">{props.title}</h1>
          <p className="mt-2 text-sm ">
            {props.tagList && props.tagList.length > 0 && "tags :"}
            {props.tagList?.map((tag, index) => (
              <Link
                key={index}
                to={`/${tag}`}
                className={`mx-1 rounded-lg p-1 hover:p-1.5 hover:transition-all duration-500 hover:bg-primary ${
                  tag === "ภาพสี" ? "bg-amber-300" : "bg-slate-200"
                }`}
              >
                {tag}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Description;
