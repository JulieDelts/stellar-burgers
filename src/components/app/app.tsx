import { useEffect } from 'react';
import {
  useLocation,
  useNavigate,
  Location,
  Route,
  Routes
} from 'react-router-dom';
import { AppHeader } from '../../../src/components/app-header';
import { Modal } from '../../../src/components/modal';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '../../../src/pages';
import { OrderInfo } from '../../../src/components/order-info';
import { IngredientDetails } from '../../../src/components/ingredient-details';
import styles from './app.module.css';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} from '../../services/selectors/ingredients';
import {
  selectIsAuthenticated,
  selectUserChecked
} from '../../services/selectors/user';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { fetchUser } from '../../services/slices/user-slice';
import { Preloader } from '../ui/preloader';
import { ProtectedRoute, UnauthenticatedRoute } from '../route';
import '../../index.css';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredients = useSelector(selectIngredients);
  const error = useSelector(selectIngredientsError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userChecked = useSelector(selectUserChecked);

  const state = location.state as { background?: Location };
  const background = state?.background;

  const handleCloseModal = () => navigate(-1);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/login'
          element={
            <UnauthenticatedRoute>
              <Login />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <UnauthenticatedRoute>
              <Register />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <UnauthenticatedRoute>
              <ForgotPassword />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <UnauthenticatedRoute>
              <ResetPassword />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='' onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}

      {isIngredientsLoading && <Preloader />}
      {error && (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      )}
      {!isIngredientsLoading && !error && ingredients.length === 0 && (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет ингредиентов
        </div>
      )}
    </div>
  );
};

export default App;
