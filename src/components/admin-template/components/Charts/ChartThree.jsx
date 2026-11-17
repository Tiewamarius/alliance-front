
const ChartThree = () => {
  const data = [
    { label: 'En attente', value: 25, color: '#F59E0B' },
    { label: 'En transit', value: 45, color: '#3C50E0' },
    { label: 'Livrées', value: 30, color: '#10B981' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  let currentAngle = 0;

  const gradient = data.map((item) => {
    const start = currentAngle;
    currentAngle += (item.value / total) * 360;

    return `${item.color} ${start}deg ${currentAngle}deg`;
  });

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        État des expéditions
      </h4>

      <p className="mb-6 text-sm text-gray-500">
        Répartition par statut
      </p>

      <div className="flex justify-center">
        <div
          className="relative flex h-52 w-52 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${gradient.join(', ')})`,
          }}
        >
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white dark:bg-boxdark">
            <div className="text-center">
              <p className="text-2xl font-bold text-black dark:text-white">
                100%
              </p>
              <span className="text-xs text-gray-500">Total</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {item.label}
              </span>
            </div>

            <span className="text-sm font-semibold text-black dark:text-white">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartThree;
