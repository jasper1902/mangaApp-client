import { useEffect } from "react";
import { themeChange } from "theme-change";
import ThemeList from "./ThemeList";
import { MdKeyboardArrowDown } from "react-icons/md";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

const Theme = () => {
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project

    const theme = localStorage.getItem("theme");
    if (!theme) {
      localStorage.setItem("theme", "retro");
    }
  }, []);
  return (
    <div className="dropdown z-50">
      <label tabIndex={0} className="btn btn-ghost border-primary p-3 m-1">
        Theme
        <MdKeyboardArrowDown className="text-xl" />
      </label>
      <div className="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px max-h-96 h-[70vh] w-52 overflow-y-auto shadow-2xl mt-16 overflow-auto scrollbar-thin scrollbar-thumb-zinc-800">
        <div className="grid grid-cols-1 gap-3 p-3" tabIndex={0}>
          {themes.map((theme, index) => (
            <ThemeList theme={theme} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Theme;
