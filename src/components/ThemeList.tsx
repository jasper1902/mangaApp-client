import { useEffect, useState } from "react";

type Props = {
  theme: string;
};

const ThemeList = (props: Props) => {
  const [theme, setTheme] = useState<string>();
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const getTheme = await localStorage.getItem("theme");
    if (getTheme) {
      setTheme(getTheme);
    }
  };

  const onClickHandler = async (theme: string) => {
    await localStorage.setItem("theme", theme);
    setTheme(theme);
  };
  return (
    <button
      className="outline-base-content overflow-hidden rounded-lg text-left [&_svg]:visible "
      data-set-theme={props.theme}
      onClick={() => onClickHandler(props.theme)}
      data-act-class="[&_svg]:visible"
    >
      <div
        data-theme={props.theme}
        className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
      >
        <div className="grid grid-cols-5 grid-rows-3">
          <div className="col-span-5 row-span-3 row-start-1 flex gap-2 py-3 px-4 items-center">
            {theme === props.theme ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3 h-3 invisible"
              >
                <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
              </svg>
            ) : (
              <div></div>
            )}
            <div className="flex-grow text-sm font-bold">{props.theme}</div>
            <div className="flex flex-shrink-0 flex-wrap gap-1 h-full">
              <div className="bg-secondary w-2 rounded"></div>{" "}
              <div className="bg-accent w-2 rounded"></div>{" "}
              <div className="bg-neutral w-2 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ThemeList;
