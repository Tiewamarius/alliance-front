
const activities = [
  {
    name: 'Nouvelle expédition',
    description: 'Une nouvelle expédition a été enregistrée.',
    time: 'Récemment',
    icon: '📦',
  },
  {
    name: 'Livraison effectuée',
    description: 'Une expédition a été livrée.',
    time: 'Aujourd’hui',
    icon: '✅',
  },
  {
    name: 'Nouveau client',
    description: 'Un nouveau client a rejoint la plateforme.',
    time: 'Aujourd’hui',
    icon: '👤',
  },
  {
    name: 'Paiement reçu',
    description: 'Un paiement a été enregistré.',
    time: 'Aujourd’hui',
    icon: '💳',
  },
];

const ChatCard = () => {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Activités récentes
      </h4>

      <div className="space-y-5">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-meta-4">
              <span className="text-xl">{activity.icon}</span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h5 className="text-sm font-semibold text-black dark:text-white">
                  {activity.name}
                </h5>

                <span className="shrink-0 text-xs text-gray-500">
                  {activity.time}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatCard;
