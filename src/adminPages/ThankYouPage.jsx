import { useSelector } from "react-redux";
import favicon from "../otherImages/favicon.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const { role } = useSelector(state => state.auth);


  const redirecBack = () => {
    if (role === 'client') {
      navigate('/all-packages');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <style>
        {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

                .thankyou-container {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  text-align: center;
                  padding: 20px;
                  font-family: 'Poppins', sans-serif;
                }

                .thankyou-logo {
                  width: 90px;
                  margin-bottom: 20px;
                }

                .thankyou-title {
                  font-size: 52px;
                  font-weight: 600;
                  color: #1E1E4B;
                  margin-bottom: 5px;
                }

                .thankyou-subtitle {
                  font-size: 30px !important;
                  font-weight: 700;
                  color: #D12D2E;
                  margin-bottom: 25px;
                }

                .thankyou-text {
                  font-size: 16px;
                  line-height: 1.8;
                  color: #2E2E2E;
                  max-width: 620px;
                  margin-bottom: 40px;
                }

                .thankyou-button {
                  padding: 14px 36px;
                  font-size: 15px;
                  font-weight: 600;
                  cursor: pointer;
                  border-radius: 50px;
                  border: none;
                  background-color: #D12D2E;
                  color: #fff;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  transition: all 0.3s ease;
                }

                .thankyou-button:hover {
                  background-color: #a52021;
                  transform: translateY(-2px);
                }
                `}
      </style>

      <div className="thankyou-container">
        <img src={favicon} alt="Koderspedia logo" className="thankyou-logo" />
        <h1 className="thankyou-title">Thank You</h1>
        <h1 className="thankyou-subtitle">Payment Done Successfully</h1>
        <p className="thankyou-text">
          Your payment was completed successfully. Thank you for your trust and support, and we are excited to continue serving you. Click the button below to return to the home page.
        </p>
        <button type="button" onClick={redirecBack} className="thankyou-button">
          Back
        </button>
      </div>
    </>
  );
};

export default ThankYouPage;
