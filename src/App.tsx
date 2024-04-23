import Card from "./components/Card";
import "./App.css";
import CardTwo from "./components/Card/CardTwo";

function App() {
  return (
    <div className="container">
      <Card inputTitle="Bajariladigan task" />
      <CardTwo inputTitle="Davom etayotgan" />
      <Card inputTitle="Just" />
      <Card inputTitle="Tugagan" />
    </div>
  );
}

export default App;
