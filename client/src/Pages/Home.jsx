import { useEffect, useState } from "react";
import NomineeCard from "../Component/NomineeCard";
import axios from "axios";
// const nomineesData = [
//   {
//     id: 1,
//     name: "Alice Johnson",
//     department: "Computer Science",
//     image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
//   },
//   {
//     id: 2,
//     name: "Michael Lee",
//     department: "Engineering",
//     image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
//   },
//   {
//     id: 3,
//     name: "Sophia Brown",
//     department: "Business Admin",
//     image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
//   },
//   {
//     id: 4,
//     name: "Daniel Smith",
//     department: "Information Tech",
//     image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
//   },
// ];


const Home = () => {
  const [nomineesData, setNomineesData] = useState([]);
const fetchNominees = async () => {
    await axios.get("http://localhost:3270/api/nominee/get")
    .then((res)=>{
      console.log(res.data.data);
      setNomineesData(res.data.data)
    })
    .catch((err)=>{
      console.log(err);
    });
}
useEffect(()=>{
  fetchNominees();
},[]);

const handleVote = (nomineeId) => {
    // Implement vote handling logic here
    alert(`Voted for nominee ID: ${nomineeId}`);
  };
  return (
    <>
      <div className="pt-24 min-h-screen  px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-10">
            Meet the Nominees
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {nomineesData.map((nominee) => (
              <NomineeCard
                key={nominee.id}
                nominee={nominee}
                // vote={votes[nominee.id]}
                onVote={() => handleVote(nominee.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
