import React from "react";
import {PageLayout} from "presentation/components/atomic-reusable/page-layout";
import {InviteUsersContainer} from "./container";
import {AppSocketInviteMatchProps} from "prop-types/match-extends-types";

export const InviteUsers: React.FC<AppSocketInviteMatchProps> = props => {
  const {Application} = props;
  return (
          <PageLayout Application={Application}>
            <InviteUsersContainer {...props} />
          </PageLayout>
  );
};