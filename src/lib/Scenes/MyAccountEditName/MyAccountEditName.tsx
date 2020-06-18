import { Flex, Join, Sans, Separator } from "@artsy/palette"
import { MyAccountEditNameMutation } from "__generated__/MyAccountEditNameMutation.graphql"
import { MyAccountEditNameQuery } from "__generated__/MyAccountEditNameQuery.graphql"
import { Input } from "lib/Components/Input/Input"
import LoadingModal from "lib/Components/Modals/LoadingModal"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React, { useEffect, useRef, useState } from "react"
import { InteractionManager, TouchableOpacity, View } from "react-native"
import { commitMutation, createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
import { MyAccountEditName_me } from "../../../__generated__/MyAccountEditName_me.graphql"

const MyAccountEditName: React.FC<{ me: MyAccountEditName_me; relay: RelayProp }> = ({ me, relay }) => {
  const [name, setName] = useState<string>(me.name!)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const navRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      SwitchBoard.updateShouldHideBackButton(true)
    }, 500)
  }, [])

  const onCompletedSave = () => {
    setIsSaving(false)
    SwitchBoard.dismissNavigationViewController(navRef.current!)
  }

  const onErrorSave = () => {
    InteractionManager.runAfterInteractions(() => {
      setIsSaving(false)
    })
  }

  const handleSave = () => {
    setIsSaving(true)
    commitMutation<MyAccountEditNameMutation>(relay.environment, {
      onCompleted: onCompletedSave,
      mutation: graphql`
        mutation MyAccountEditNameMutation($input: UpdateMyProfileInput!) {
          updateMyUserProfile(input: $input) {
            me {
              name
            }
          }
        }
      `,
      variables: {
        input: {
          name,
        },
      },
      onError: onErrorSave,
    })
  }

  const savingDisabled = Boolean(!name || name === me.name || isSaving)

  return (
    <Flex pt="2" ref={navRef}>
      <Join separator={<Separator my={2} />}>
        <Flex flexDirection="row" justifyContent="space-between" px={2}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => SwitchBoard.dismissNavigationViewController(navRef.current!)}>
              <Sans size="4" weight="medium" textAlign="left">
                Cancel
              </Sans>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Sans size="4" weight="medium">
              Full Name
            </Sans>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <TouchableOpacity disabled={savingDisabled} onPress={handleSave}>
              <Sans size="4" weight="medium" opacity={savingDisabled ? 0.3 : 1}>
                Save
              </Sans>
            </TouchableOpacity>
          </View>
        </Flex>
        <Flex px={2}>
          <LoadingModal isVisible={isSaving} />
          <Input showClearButton value={name} onChangeText={setName} autoFocus />
        </Flex>
      </Join>
    </Flex>
  )
}

const MyAccountEditNamePlaceholder: React.FC<{}> = ({}) => {
  return (
    <Flex pt="2">
      <Join separator={<Separator my={2} />}>
        <Sans size="4" weight="medium" textAlign="center">
          Full Name
        </Sans>
        <Flex px={2} py={1}>
          <PlaceholderText width={100 + Math.random() * 100} />
        </Flex>
      </Join>
    </Flex>
  )
}

const MyAccountEditNameContainer = createFragmentContainer(MyAccountEditName, {
  me: graphql`
    fragment MyAccountEditName_me on Me {
      name
    }
  `,
})

export const MyAccountEditNameQueryRenderer: React.FC<{}> = () => {
  return (
    <QueryRenderer<MyAccountEditNameQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyAccountEditNameQuery {
          me {
            ...MyAccountEditName_me
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MyAccountEditNameContainer,
        renderPlaceholder: () => <MyAccountEditNamePlaceholder />,
      })}
      variables={{}}
    />
  )
}