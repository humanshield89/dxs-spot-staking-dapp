import React, { Fragment, lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import { ROUTES_NAMES } from "./constants";
import StakingLayout from "./layout/StakingLayout";

export const renderRoutes = (routes = []) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route, i) => {
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Component = route.component;

          return (
            <Route
              key={i}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                <Guard>
                  <Layout>
                    {route.routes ? (
                      renderRoutes(route.routes)
                    ) : (
                      <Component {...props} />
                    )}
                  </Layout>
                </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  );
};

const routes = [
  {
    //exact: true,
    path: ROUTES_NAMES.DAPP,
    layout: StakingLayout,
    routes: [
      {
        path: ROUTES_NAMES.STAKING,
        exact: true,
        component: lazy(() => import("./views/Farms")),
      },
      {
        path: "/",
        exact: true,
        component: () => <Redirect to={ROUTES_NAMES.STAKING} />,
      },
      {
        path: "*",
        exact: true,
        component: () => <Redirect to={ROUTES_NAMES.STAKING} />,
      },
    ],
  },
  {
    path: "/",
    exact: true,
    component: () => <Redirect to={ROUTES_NAMES.STAKING} />,
  },
  {
    path: "*",
    exact: true,
    component: () => <Redirect to={ROUTES_NAMES.STAKING} />,
  },
];

export default routes;
