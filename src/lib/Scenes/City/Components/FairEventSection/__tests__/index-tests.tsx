import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Text } from "react-native"
import { FairEventSection } from "../index"

const data = [
  {
    name: "TEFAF New York Fall 2019",
    id: "RmFpcjp0ZWZhZi1uZXcteW9yay1mYWxsLTIwMTk=",
    gravityID: "tefaf-new-york-fall-2019",
    image: {
      aspect_ratio: 1,
      url: "https://d32dm0rphc51dk.cloudfront.net/3cn9Ln3DfEnHxJcjvfBNKA/wide.jpg",
    },
    end_at: "2001-12-15T12:00:00+00:00",
    start_at: "2001-11-12T12:00:00+00:00",
  },
] as any[]

describe("FairEventSection", () => {
  it("renders properly", () => {
    const tree = renderWithWrappers(<FairEventSection data={data} citySlug="tefaf-new-york-fall-2019" />).root

    expect(tree.findAllByType(Text)[1].props.children).toMatch("TEFAF New York Fall 2019")
  })
})
