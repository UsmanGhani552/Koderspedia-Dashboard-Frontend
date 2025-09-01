import React from "react";
import MasterLayout from "../otherImages/MasterLayout";
import BrandDataTable from "../components/BrandDataTable";
import DefaultTopBar from "../components/DefaultTopBar";

const ManageBrands = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        <DefaultTopBar
            title="Manage Brands"
            desc="View, create, edit, and manage Brand accounts efficiently."
            btnText="Add Brand"
            btnLink="/add-brand" 
        />

        {/* TableDataLayer */}
        <BrandDataTable />

      </MasterLayout>

    </>
  );
};

export default ManageBrands; 
