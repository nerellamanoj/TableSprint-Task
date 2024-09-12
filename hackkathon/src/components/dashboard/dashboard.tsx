import Navbar from '../navbar/navbar';
import Sidebar from '../sidebar/sidebar';

function Dashboard() {
  return (
    <div className="flex flex-col h-screen overflow-x-hidden">
      <Navbar />

      <div className="flex h-full">
        {/* Sidebar with fixed width */}
        <div className="w-64"> <Sidebar /> </div>

        {/* Main content */}
        <div className="flex flex-col justify-center items-center w-full">
          <img src="https://res.cloudinary.com/djexsyuur/image/upload/v1726052386/New_TS_Logo_page-0001_1_2_mzv22j.png" loading="lazy" alt="TableSprint logo" className="mb-4" />
          <h1>Welcome to tablesprint admin</h1>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
