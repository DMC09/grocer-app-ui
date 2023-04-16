import GroceryStore from "../components/grocerystore";

export default function Dashboard({data}: any) {


const groceryStoresToRender = data.map((groceryStore: any) =>{
    return <GroceryStore key={groceryStore.id} {...groceryStore}/>;
})

return <>{groceryStoresToRender}</>
//   return (
//     <>
//       <h1>Dashboard</h1>
//       {data && groceryStoresToRender}
//     </>
//   );
}
