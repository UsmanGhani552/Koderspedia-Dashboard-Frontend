import React from "react";
import MasterLayout from "../otherImages/MasterLayout";
import ClientPackageTable from "../components/ClientPackageTable";
import DefaultTopBar from "../components/DefaultTopBar";
import HomeTopBar from "../components/HomeTopBar";
import { useSelector } from "react-redux";

const ClientPackagesPage = () => {
  const {user} = useSelector((state) => state.auth);
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout> 
        <HomeTopBar
        title={`Welcome Back, ${user.name?.replace(/\b\w/g, c => c.toUpperCase())}!`}
         desc="Your recruitment metrics and activities at a glance"
        />
        <DefaultTopBar
            title="Package Details"
            desc="Subscribe one of the following package according to your needs."
            btnText="New Package"
            // btnLink="/add-package" 
        />

        {/* TableDataLayer */}
        <ClientPackageTable />

      </MasterLayout>

    </>
  );
};

export default ClientPackagesPage; 
