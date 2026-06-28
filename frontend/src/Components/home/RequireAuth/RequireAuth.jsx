import {
  useAuthState,
  useSendEmailVerification,
} from "react-firebase-hooks/auth";
import { Navigate, useLocation } from "react-router-dom";
import auth from "../../../firebase.init";
import Error from "../../Utilities/Error/Error";
import Loading from "../../Utilities/Loading/Loading";

const RequireAuth = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  const [sendEmailVerification, sending, error] =
    useSendEmailVerification(auth);

  if (loading || sending) {
    return <Loading />;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  let err;
  if (error) {
    err = <Error error={error} />;
  }

  // if (user.providerData[0]?.providerId === "password" && !user.emailVerified) {
  //   return (
  //     <div className="text-center mt-5">
  //       {err}
  //       <h3 className="text-danger">Your Email is not verified!!</h3>
  //       <h5 className="text-success"> Please Verify your email address</h5>
  //       <Button
  //         className="btn btn-primary"
  //         onClick={async () => {
  //           await sendEmailVerification();
  //           toast("Verification email sent to your account");
  //         }}
  //       >
  //         Send Verification Email Again
  //       </Button>
  //     </div>
  //   );
  // }
  return children;
};

export default RequireAuth;
