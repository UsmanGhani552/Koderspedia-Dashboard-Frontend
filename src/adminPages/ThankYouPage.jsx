import { useSelector } from "react-redux";
import favicon from "../otherImages/favicon.svg";
import { useNavigate } from "react-router-dom";

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
                  font-size: 48px;
                  font-weight: 700;
                  color: #D12D2E;
                  margin-bottom: 25px;
                }

                .thankyou-text {
                  font-size: 16px;
                  line-height: 1.8;
                  color: #2E2E2E;
                  max-width: 1300px;
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
                <h1 className="thankyou-title">Thank You For Choosing</h1>
                <h1 className="thankyou-subtitle">Koderspedia</h1>
                <p className="thankyou-text">
                    Our dedicated team is eagerly waiting to connect with you and offer a complimentary consultation.
                    Please take a moment to schedule a time that suits your availability best. During our consultation,
                    we’ll delve into your project requirements, providing a detailed assessment tailored precisely to your needs.
                    Rest assured, your data’s confidentiality is of utmost importance to us, which is why we reinforce our
                    commitment by signing a non-disclosure agreement (NDA). By partnering with us, you can expect excellence,
                    trust, and a collaborative journey towards achieving your goals.
                </p>
                <button type="button" onClick={redirecBack} className="thankyou-button">
                    Back
                </button>
            </div>
        </>
    );
};

export default ThankYouPage;
