
const ChartOne = () => {
  const values = [35, 55, 42, 75, 60, 85, 65, 95, 70, 80, 60, 90];
  const labels = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc',
  ];

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Évolution des expéditions
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Volume mensuel des expéditions
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        <svg
          viewBox="0 0 600 240"
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          {[40, 90, 140, 190].map((y) => (
            <line
              key={y}
              x1="35"
              y1={y}
              x2="590"
              y2={y}
              stroke="currentColor"
              opacity="0.12"
              strokeDasharray="4 4"
            />
          ))}

          <polyline
            points={values
              .map((value, index) => {
                const x = 40 + index * 49;
                const y = 200 - value * 1.7;
                return `${x},${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="#3C50E0"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {values.map((value, index) => (
            <circle
              key={index}
              cx={40 + index * 49}
              cy={200 - value * 1.7}
              r="4"
              fill="#3C50E0"
            />
          ))}
        </svg>
      </div>

      <div className="mt-3 flex justify-between text-xs text-gray-500">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
};

export default ChartOne;
