import React from "react"
import { graphql } from "react-relay"

import { Theme } from "@artsy/palette"
import { ShowFixture } from "lib/__fixtures__/ShowFixture"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { ShowEventSectionContainer as ShowEventSection } from "../ShowEventSection"

jest.unmock("react-relay")

describe("ShowEventSection", () => {
  it("renders", async () => {
    const tree = await renderRelayTree({
      Component: ({ show }) => (
        <Theme>
          <ShowEventSection event={show.events[0]} />
        </Theme>
      ),
      query: graphql`
        query ShowEventSectionTestsQuery {
          show(id: "anderson-fine-art-gallery-flickinger-collection") {
            events {
              ...ShowEventSection_event
            }
          }
        }
      `,
      mockData: {
        show: ShowFixture,
      },
    })
    expect(tree.html()).toMatchSnapshot()
  })
})
