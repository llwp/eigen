import { ArtistInsights_artist } from "__generated__/ArtistInsights_artist.graphql"
import { ArtistInsights_priceInsights } from "__generated__/ArtistInsights_priceInsights.graphql"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Join, Separator } from "palette"
import React, { useCallback, useState } from "react"
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { ReactElement } from "simple-markdown"
import { ArtistInsightsAuctionResultsPaginationContainer } from "./ArtistInsightsAuctionResults"
import { MarketStatsFragmentContainer } from "./MarketStats"

interface ArtistInsightsProps {
  artist: ArtistInsights_artist
  priceInsights: ArtistInsights_priceInsights
}

export interface ViewableItems {
  viewableItems?: ViewToken[]
}

interface ViewToken {
  item?: ReactElement
  key?: string
  index?: number | null
  isViewable?: boolean
  section?: any
}

const FILTER_BUTTON_OFFSET = 100
export const ArtistInsights: React.FC<ArtistInsightsProps> = ({ artist, priceInsights }) => {
  const [isFilterButtonVisible, setIsFilterButtonVisible] = useState(false)
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)

  const openFilterModal = () => {
    setIsFilterModalVisible(true)
  }

  const closeFilterModal = () => {
    setIsFilterModalVisible(false)
  }

  // Show or hide floating filter button depending on the scroll position
  const onScrollEndDrag = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event.nativeEvent.targetContentOffset.y > FILTER_BUTTON_OFFSET) {
      setIsFilterButtonVisible(true)
      return
    }
    setIsFilterButtonVisible(false)
  }, [])

  return (
    <ArtworkFilterGlobalStateProvider>
      <StickyTabPageScrollView contentContainerStyle={{ paddingTop: 20 }} onScrollEndDrag={onScrollEndDrag}>
        <Join separator={<Separator my={2} ml={-2} width={useScreenDimensions().width} />}>
          <MarketStatsFragmentContainer priceInsights={priceInsights} />
          <ArtistInsightsAuctionResultsPaginationContainer artist={artist} />
          <FilterModalNavigator
            isFilterArtworksModalVisible={isFilterModalVisible}
            id={artist.id}
            slug={artist.slug}
            mode={FilterModalMode.AuctionResults}
            exitModal={closeFilterModal}
            closeModal={closeFilterModal}
            title="Filter auction results"
          />
        </Join>
      </StickyTabPageScrollView>

      <AnimatedArtworkFilterButton
        isVisible={isFilterButtonVisible}
        onPress={openFilterModal}
        text="Filter auction results"
      />
    </ArtworkFilterGlobalStateProvider>
  )
}

export const ArtistInsightsFragmentContainer = createFragmentContainer(ArtistInsights, {
  artist: graphql`
    fragment ArtistInsights_artist on Artist {
      name
      id
      slug
      ...ArtistInsightsAuctionResults_artist
    }
  `,
  priceInsights: graphql`
    fragment ArtistInsights_priceInsights on PriceInsightConnection {
      ...MarketStats_priceInsights
    }
  `,
})
