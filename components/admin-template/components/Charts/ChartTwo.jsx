
const ChartTwo = () => {
  const data = [
    { month: 'Jan', value: 35 },
    { month: 'Fév', value: 55 },
    { month: 'Mar', value: 45 },
    { month: 'Avr', value: 75 },
    { month: 'Mai', value: 60 },
    { month: 'Juin', value: 90 },
  ];

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        Revenus
      </h4>

      <p className="mb-8 text-sm text-gray-500">
        Évolution des revenus mensuels
      </p>

      <div className="flex h-64 items-end justify-around gap-3">
        {data.map((item) => (
          <div
            key={item.month}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <div className="flex h-full w-full items-end">
              <div
                className="w-full rounded-t-sm bg-primary transition-all"
                style={{ height: `${item.value}%` }}
                title={`${item.value}%`}
              />
            </div>

            <span className="text-xs text-gray-500">
              {item.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartTwo;
