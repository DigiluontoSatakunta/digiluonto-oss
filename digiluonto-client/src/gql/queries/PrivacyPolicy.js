import { gql } from "@apollo/client";

export const PRIVACY_POLICY_QUERY = gql`
  query PrivacyPolicyPage($locale: String) {
    privacyPolicy(locale: $locale) {
      id
      title
      content
    }
  }
`;
