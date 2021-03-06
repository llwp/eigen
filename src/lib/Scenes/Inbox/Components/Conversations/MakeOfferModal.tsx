import { MakeOfferModal_artwork } from "__generated__/MakeOfferModal_artwork.graphql"
import { MakeOfferModalQuery, MakeOfferModalQueryResponse } from "__generated__/MakeOfferModalQuery.graphql"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { CollapsibleArtworkDetailsFragmentContainer as CollapsibleArtworkDetails } from "lib/Scenes/Artwork/Components/CommercialButtons/CollapsibleArtworkDetails"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { BorderBox, Button, Flex, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface MakeOfferModalProps {
  toggleVisibility: () => void
  modalIsVisible: boolean
  artwork: MakeOfferModal_artwork
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({ ...props }) => {
  const { toggleVisibility, modalIsVisible, artwork } = props

  return (
    <FancyModal
      visible={modalIsVisible}
      onBackgroundPressed={() => {
        toggleVisibility()
      }}
    >
      <FancyModalHeader
        onLeftButtonPress={() => {
          toggleVisibility()
        }}
        leftButtonText="Cancel"
        rightButtonDisabled
        rightButtonText=" "
        hideBottomDivider
      ></FancyModalHeader>
      <Flex p={1.5}>
        <Text variant="largeTitle">Confirm Artwork</Text>
        <Text variant="small" color="black60">
          {" "}
          Make sure the artwork below matches the intended work you're making an offer on.
        </Text>
        <BorderBox p={0} my={2}>
          <CollapsibleArtworkDetails hasSeparator={false} artwork={artwork} />
        </BorderBox>
        <Button size="large" variant="primaryBlack" block width={100} mb={1}>
          Confirm
        </Button>
        <Button
          size="large"
          variant="secondaryOutline"
          block
          width={100}
          onPress={() => {
            toggleVisibility()
          }}
        >
          Cancel
        </Button>
      </Flex>
    </FancyModal>
  )
}

export const MakeOfferModalFragmentContainer = createFragmentContainer(MakeOfferModal, {
  artwork: graphql`
    fragment MakeOfferModal_artwork on Artwork {
      ...CollapsibleArtworkDetails_artwork
    }
  `,
})

export const MakeOfferModalQueryRenderer: React.FC<{
  artworkID: string
  modalIsVisible: boolean
  toggleVisibility: () => void
}> = ({ artworkID, toggleVisibility, modalIsVisible }) => {
  return (
    <QueryRenderer<MakeOfferModalQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MakeOfferModalQuery($artworkID: String!) {
          artwork(id: $artworkID) {
            ...MakeOfferModal_artwork
          }
        }
      `}
      variables={{
        artworkID,
      }}
      render={renderWithLoadProgress<MakeOfferModalQueryResponse>(({ artwork }) => (
        <MakeOfferModalFragmentContainer
          artwork={artwork!}
          modalIsVisible={modalIsVisible}
          toggleVisibility={toggleVisibility}
        />
      ))}
    />
  )
}
