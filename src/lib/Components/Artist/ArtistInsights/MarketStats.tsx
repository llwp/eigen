import { MarketStats_priceInsights } from "__generated__/MarketStats_priceInsights.graphql"
import { MarketStatsQuery } from "__generated__/MarketStatsQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Flex, Text } from "palette"
import React from "react"
import { Image, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface MarketStatsProps {
  priceInsights: MarketStats_priceInsights
}

const MarketStats: React.FC<MarketStatsProps> = ({ priceInsights }) => {
  if ((priceInsights.edges?.length || 0) <= 0) {
    return null
  }

  const priceInsight = priceInsights.edges?.[0]?.node
  const averageValueSold = (priceInsight?.annualValueSoldCents as number) / (priceInsight?.annualLotsSold || 1)

  return (
    <>
      <Flex flexDirection="row" alignItems="center">
        <Text variant="title" mr={5}>
          Market Stats by Medium
        </Text>
        <TouchableOpacity hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Image source={require("@images/info.png")} />
        </TouchableOpacity>
      </Flex>
      <Text>{priceInsight?.medium}</Text>
      {/* Market Stats Values */}
      <Flex flexDirection="row" flexWrap="wrap" mt={15}>
        <Flex width="50%">
          <Text variant="largeTitle">{priceInsight?.annualLotsSold}</Text>
          <Text variant="text">Yearly lots sold</Text>
        </Flex>
        <Flex width="50%">
          <Text variant="largeTitle">{priceInsight?.sellThroughRate}%</Text>
          <Text variant="text">Sell-through rate</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Text variant="largeTitle">${averageValueSold}</Text>
          <Text variant="text">Average sale price</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Text variant="largeTitle">{priceInsight?.medianSaleOverEstimatePercentage}%</Text>
          <Text variant="text">Sale price over estimate</Text>
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
          annualLotsSold
          annualValueSoldCents
          sellThroughRate
          medianSaleOverEstimatePercentage
        }
      }
    }
  `,
})

export const MarketStatsQueryRenderer: React.FC<{
  artistInternalID: string
}> = ({ artistInternalID }) => {
  return (
    <QueryRenderer<MarketStatsQuery>
      environment={defaultEnvironment}
      variables={{ artistInternalID }}
      query={graphql`
        query MarketStatsQuery($artistInternalID: ID!) {
          priceInsights(artistId: $artistInternalID) {
            ...MarketStats_priceInsights
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MarketStatsFragmentContainer,
        renderPlaceholder: LoadingSkeleton,
      })}
    />
  )
}

const LoadingSkeleton = () => {
  return <Text>Loading!!!!</Text>
}
