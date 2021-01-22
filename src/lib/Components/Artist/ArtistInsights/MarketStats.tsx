import { MarketStats_priceInsights } from "__generated__/MarketStats_priceInsights.graphql"
import { Flex, Text } from "palette"
import React from "react"
import { Image, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface MarketStatsProps {
  priceInsights: MarketStats_priceInsights
}

const MarketStats: React.FC<MarketStatsProps> = ({ priceInsights }) => {
  return (
    <>
      <Flex flexDirection="row" alignItems="center">
        <Text variant="title" mr={5}>
          Market Stats
        </Text>
        <TouchableOpacity hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Image source={require("@images/info.png")} />
        </TouchableOpacity>
      </Flex>
      <Text variant="small" color="black60">
        Based on the last 12 months of auction data
      </Text>
      {priceInsights.edges?.map((e) => {
        return (
          <Text>
            {e?.node?.medium}: {e?.node?.annualValueSoldCents}
          </Text>
        )
      })}
      {/* Market Stats Values */}
      <Flex flexDirection="row" flexWrap="wrap" mt={15}>
        <Flex width="50%">
          <Text variant="text">Average sale price</Text>
          <Text variant="largeTitle">$168k</Text>
        </Flex>
        <Flex width="50%">
          <Text variant="text">Total lots sold</Text>
          <Text variant="largeTitle">61</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Text variant="text">Realized / estimate</Text>
          <Text variant="largeTitle">2.12x</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Text variant="text">Sell-through rate</Text>
          <Text variant="largeTitle">90%</Text>
        </Flex>
      </Flex>
    </>
  )
}

export const MarketStatsFragmentContainer = createFragmentContainer(MarketStats, {
  priceInsights: graphql`
    fragment MarketStats_priceInsights on PriceInsightConnection {
      edges {
        node {
          medium
          annualValueSoldCents
        }
      }
    }
  `,
})
