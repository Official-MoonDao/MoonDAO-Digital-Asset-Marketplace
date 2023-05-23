const ArrowButton = ({ text, position }) => {
  return (
    <button
      className={`${position} font-mono flex text-gray-100 hover:bg-indigo-900 hover:text-white duration-150 items-center gap-2 border-[0.6px] rounded border-white border-opacity-50 py-3 pl-4 pr-3 font-bold`}
    >
      {text}{" "}
      <svg className="w-6 h-6 transform -scale-x-100" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="stroke-white" d="M19 5.5L5 19.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path className="stroke-white" d="M13 19.5H5V11.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

export default ArrowButton;
