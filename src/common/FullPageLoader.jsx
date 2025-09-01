// components/FullPageLoader.jsx
import React from 'react';

const FullPageLoader = ({content}) => {
    return (
        <div className={`${content}-loader`}>
            <div className="spinner-grow" role="status">
                <span className="sr-only"></span>
            </div>
        </div>
    );
};

export default FullPageLoader;
