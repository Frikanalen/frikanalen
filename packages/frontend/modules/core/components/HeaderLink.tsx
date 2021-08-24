import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";

type Accent = "accent" | "secondAccent" | "thirdAccent";

const Anchor = styled.a<{ active: boolean; accent: Accent }>`
  font-weight: 900;
  font-size: 24px;

  margin-left: 24px;
  color: ${(props) => props.theme.fontColor.muted};

  transition: 200ms ease color;

  ${(props) => {
    if (props.active) {
      const accent = props.theme.color[props.accent];

      return css`
        color: ${accent};

        &:hover {
          color: ${accent};
        }
      `;
    } else {
      return css`
        &:hover {
          color: ${props.theme.fontColor.normal};
        }
      `;
    }
  }}
`;

export type HeaderLinkProps = {
  to: string;
  label: string;
  accent: Accent;
};

export function HeaderLink(props: HeaderLinkProps) {
  const { to, label, accent } = props;

  const router = useRouter();
  const active = router.pathname == to;

  return (
    <Link href={to} passHref>
      <Anchor accent={accent} active={active}>
        {label}
      </Anchor>
    </Link>
  );
}
