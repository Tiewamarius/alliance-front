
const CardDataStats = ({
  title,
  total,
  rate,
  levelUp = false,
  children,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-7 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {total}
          </h4>

          <span className="text-sm font-medium">{title}</span>
        </div>

        {rate && (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              levelUp ? 'text-meta-3' : 'text-meta-5'
            }`}
          >
            {rate}
            <span>{levelUp ? '↑' : '↓'}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default CardDataStats;
