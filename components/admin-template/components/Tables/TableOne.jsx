
const shipments = [
  {
    code: 'EXP-2026-001',
    client: 'Client A',
    destination: 'Abidjan',
    amount: '150 000 FCFA',
    status: 'Livrée',
  },
  {
    code: 'EXP-2026-002',
    client: 'Client B',
    destination: 'Bouaké',
    amount: '85 000 FCFA',
    status: 'En transit',
  },
  {
    code: 'EXP-2026-003',
    client: 'Client C',
    destination: 'Yamoussoukro',
    amount: '220 000 FCFA',
    status: 'En attente',
  },
  {
    code: 'EXP-2026-004',
    client: 'Client D',
    destination: 'San Pedro',
    amount: '95 000 FCFA',
    status: 'Livrée',
  },
];

const statusStyles = {
  Livrée: 'bg-green-100 text-green-700',
  'En transit': 'bg-blue-100 text-blue-700',
  'En attente': 'bg-yellow-100 text-yellow-700',
};

const TableOne = () => {
  return (
    <div className="col-span-12 overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8">
      <div className="px-5 py-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Dernières expéditions
        </h4>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="bg-gray-100 text-left dark:bg-meta-4">
              <th className="px-4 py-4 text-sm font-semibold text-black dark:text-white">
                Référence
              </th>
              <th className="px-4 py-4 text-sm font-semibold text-black dark:text-white">
                Client
              </th>
              <th className="px-4 py-4 text-sm font-semibold text-black dark:text-white">
                Destination
              </th>
              <th className="px-4 py-4 text-sm font-semibold text-black dark:text-white">
                Montant
              </th>
              <th className="px-4 py-4 text-sm font-semibold text-black dark:text-white">
                Statut
              </th>
            </tr>
          </thead>

          <tbody>
            {shipments.map((shipment) => (
              <tr
                key={shipment.code}
                className="border-b border-stroke dark:border-strokedark"
              >
                <td className="px-4 py-4 text-sm font-medium text-primary">
                  {shipment.code}
                </td>

                <td className="px-4 py-4 text-sm text-black dark:text-white">
                  {shipment.client}
                </td>

                <td className="px-4 py-4 text-sm text-black dark:text-white">
                  {shipment.destination}
                </td>

                <td className="px-4 py-4 text-sm text-black dark:text-white">
                  {shipment.amount}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[shipment.status]
                    }`}
                  >
                    {shipment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableOne;
