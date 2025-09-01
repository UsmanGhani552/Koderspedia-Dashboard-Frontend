import React from "react";
import MasterLayout from "../otherImages/MasterLayout";
import AddBrandForm from "../components/AddBrandForm";
import DefaultTopBar from "../components/DefaultTopBar";

const AddBrandPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        <DefaultTopBar
            title="Add Brand"
            desc="Lorem ispum manage Brand account efficiently."
        />

        {/* TableDataLayer */}
        <AddBrandForm />

      </MasterLayout>

    </>
  );
};

export default AddBrandPage; 
