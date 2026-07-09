import { useGetActivities } from './hooks/useGetActivities.hook'
    
function ActivityList() {
    const { activities, isLoading, error } = useGetActivities();

    return (
        <div>
            <h1>Lista de atividades</h1>
            {error && <p>{error.message}</p>}
            {isLoading ? (
                <p>Carregando...</p>
            ) : (
                <ul>
                    {activities.map((activity) => (
                        <li key={activity.id}>
                            <h2>{activity.title}</h2>
                            <p>{activity.description}</p>
                            <span>{activity.status}</span>
                            <p>{activity.type}</p>
                            <p>{activity.createdAt}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ActivityList;