import { useFetchWorks } from "../../hooks/useFetchWorks";
import HomeFeedCard from "../homeFeedCard/HomeFeedCard";
import "./HomeFeed.scss"

function HomeFeed() {
  const { works, loading, error } = useFetchWorks("homeprojects");

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los trabajos</p>;

  return (
    <div className="home-feed">
      {works.map((item) => (
        <HomeFeedCard 
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}

export default HomeFeed;
