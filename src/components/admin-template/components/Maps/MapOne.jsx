
const MapOne = () => {
  const locations = [
    { name: 'Abidjan', top: '42%', left: '48%' },
    { name: 'Bouaké', top: '25%', left: '58%' },
    { name: 'Yamoussoukro', top: '35%', left: '55%' },
  ];

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8">
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        Réseau de distribution
      </h4>

      <p className="mb-5 text-sm text-gray-500">
        Visualisation des principaux points de desserte
      </p>

      <div className="relative h-80 overflow-hidden rounded-lg bg-slate-100 dark:bg-meta-4">
        <div className="absolute inset-0 opacity-30">
          <svg viewBox="0 0 600 350" className="h-full w-full">
            <path
              d="M100 50 L220 30 L340 65 L480 45 L550 140 L490 260 L370 320 L230 280 L120 220 Z"
              fill="#10B981"
              fillOpacity="0.2"
              stroke="#10B981"
              strokeWidth="3"
            />
            <path
              d="M180 70 L240 150 L360 120 L450 220"
              fill="none"
              stroke="#64748B"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
          </svg>
        </div>

        {locations.map((location) => (
          <div
            key={location.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              top: location.top,
              left: location.left,
            }}
          >
            <div className="relative flex flex-col items-center">
              <span className="h-4 w-4 rounded-full border-2 border-white bg-primary shadow-lg" />
              <span className="mt-1 rounded bg-white px-2 py-1 text-xs font-semibold text-black shadow dark:bg-boxdark dark:text-white">
                {location.name}
              </span>
            </div>
          </div>
        ))}

        <div className="absolute bottom-3 left-3 rounded bg-white px-3 py-2 text-xs text-gray-600 shadow dark:bg-boxdark dark:text-white">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
          Agences et points de desserte
        </div>
      </div>
    </div>
  );
};

export default MapOne;
