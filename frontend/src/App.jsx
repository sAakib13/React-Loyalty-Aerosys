import Brands from "./component/Brands/Brands";
import Header from "./component/Header/Header";
import Home from "./component/Home/Home";
import RegistrationForm from "./component/register/register";

function App() {
  return (
    <div className="font-jost bg-white min-h-screen">
      <Header />
      <Home />
      <Brands />
      {/* <RegistrationForm/> */}
    </div>
  );
}

export default App;
