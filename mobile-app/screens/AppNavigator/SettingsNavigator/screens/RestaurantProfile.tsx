import {tailwind} from "@tailwind";
import {Image, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {ScrolledView} from "@components/views/ScrolledView";
import {useEffect, useState} from "react";
import {ProfileSection} from "@screens/AppNavigator/SettingsNavigator/components/ProfileSections";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {useNavigation} from "@react-navigation/native";
import * as Location from 'expo-location'
import * as ImagePicker from "expo-image-picker";
import { RootState, useAppDispatch, useAppSelector } from "@store/index";
import { useForm } from "react-hook-form";
import { ShowToast, showTost } from "@components/commons/Toast";
import { fetchProfile } from "@store/profile.reducer";
import { _api } from "@api/_request";
import * as Device from 'expo-device'
import { ControlledTextInputWithLabel } from "@components/commons/inputs/ControlledTextInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid'
import { useToast } from "react-native-toast-notifications";
import { TextWithMoreInfo } from "@components/Text/TextWithMoreInfo";
import { ListingsPhotosUploadButton } from "@screens/AppNavigator/ListingsNavigator/screens/components/ListingsPhotosUploadButton";


const RestaurantProfileInteraction = {
    UPDATING_PROFILE_MESSAGE: 'Updating profile',
    GETTING_LOCATION_MESSAGE: 'Getting location',
    PROFILE_UPDATE_SUCCESS: 'Profile updated!',
    UPDATE_PROFILE_BTN: 'Update profile',
    GET_LOCATION_FAILED: 'Permission to access location was denied',
    GET_LOCATION_BTN: 'Locate',
    COORD_UPDATE: 'location coordinates updated!'
}
export interface RestaurantProfileForm {
    businessName: string
    businessAddress: string
    businessEmail: string
}

export function RestaurantProfile (): JSX.Element {
    const {hasFetchedProfile, profile } = useAppSelector((state: RootState) => state.profile)
    const dispatch = useAppDispatch()
    const navigation  = useNavigation()

    const toast = useToast()
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [editProfileState, setEditProfileState] = useState<boolean>(false)
    const [gettingLocation, setGettingLocation] = useState<boolean>(false)
    const [logo, setLogo] = useState<string | undefined>(undefined)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_restaurantImage, _setRestaurantImage] = useState<string | undefined>(undefined)
    const {control, handleSubmit, formState: { errors}, setValue} = useForm<RestaurantProfileForm>({
        criteriaMode: 'all'
    })


    useEffect(() => {
        setValue('businessName', profile.businessName)
        setValue('businessAddress', profile.businessAddress)
        setValue('businessEmail', profile.businessEmail)
        setLogo(profile.businessLogo)
        // setRestaurantImage(profile.restaurantImage)
    }, [])



    if (!hasFetchedProfile) {
        return <View>
            <Text>Fetching</Text>
        </View>
    }


    async function updateBusinessLogo (data: ImagePicker.ImagePickerAsset): Promise<void> {
        const extension = data?.fileName?.split('.')[1]
        const imagePayload = {
            uri: Device.osName === 'Andriod' ?  data?.uri : data?.uri.replace('file://', ''),
            name: `${uuid.v4()}.${extension}`,
            type: `image/${extension}`
        } as any

        const payload = new FormData()
        payload.append('logo', imagePayload)
        try {
            const photo = ( await _api.requestData({
                method: 'put',
                url: 'vendor/logo',
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*'
                },
                data: payload
            })).data
            setLogo(photo)
        } catch (error) {
            showTost(toast, 'failed to upload image', 'error')
        }
    }


    async function updateBusinessImage (data: ImagePicker.ImagePickerAsset): Promise<void> {
        const extension = data?.fileName?.split('.')[1]
        const imagePayload = {
            uri: Device.osName === 'Andriod' ?  data?.uri : data?.uri.replace('file://', ''),
            name: `${uuid.v4()}.${extension}`,
            type: `image/${extension}`
        } as any

        const payload = new FormData()
        payload.append('image', imagePayload)

        try {
            const photo = ( await _api.requestData({
                method: 'put',
                url: 'vendor/image',
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*'
                },
                data: payload
            })).data
            _setRestaurantImage(photo)
        } catch (error) {
            showTost(toast, 'failed to upload image', 'error')
        }
    }

    async function requestLocation (): Promise<void> {
        setGettingLocation(true)

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
        ShowToast('error', RestaurantProfileInteraction.GET_LOCATION_FAILED)
    }
    const {coords: {longitude, latitude}} = await Location.getCurrentPositionAsync({
        accuracy: 6
    });

         await AsyncStorage.setItem('LOCATION_COORDS', JSON.stringify( { longitude,  latitude }))
        setGettingLocation(false)

        showTost(toast, RestaurantProfileInteraction.COORD_UPDATE, 'success')

        try {
            await _api.requestData({
                method: 'put',
                url: 'vendor/profile',
                data: { coordinates: [`${longitude}`, `${latitude}`]}
            })
        } catch (error) {
            showTost(toast, 'failed to update location', 'error')
        }
    }

   async function updateProfile (data: RestaurantProfileForm): Promise<void> {
    toast.hideAll();
    setSubmitting(true)
       try {
         await _api.requestData<RestaurantProfileForm>({
            method: 'put',
            url: 'vendor/profile',
            data
        })

       setSubmitting(false)
        setEditProfileState(false)
        showTost(toast, 'profile updated!', 'success')

        await dispatch(fetchProfile())

       } catch (error: any) {

        showTost(toast,  error.message !== 'string' ? error.message[0] : error.message, 'error')
       } finally {
       setSubmitting(false)
       }
    }


    const pickImage = async (cb: (assets: any) => Promise<void>) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 1,
            selectionLimit: 1,
        });

        if (!result.canceled) {
         await  cb(result?.assets[0])
        }

        showTost(toast, 'Image updated!', 'success')
    };

    return (
        <SafeAreaView style={tailwind('flex-1 ')}>
            <ScrolledView testId="AccountProfile.View" style={tailwind('w-full px-5 pt-5 bg-white')}>
            <GoBackButton onPress={() => navigation.goBack()} />
                    <View style={tailwind('flex flex-row w-full justify-center relative')}>
                        {logo !== undefined ? (
                            <View style={tailwind('rounded-xl w-28 h-28')}>
                                <Image source={{uri: logo}} resizeMode="cover" style={tailwind('rounded-xl w-28 h-28')} />
                            </View>
                        ):  (
                            <View style={tailwind('rounded-xl w-28 h-28 bg-brand-gray-400 flex flex-row justify-center items-center') }>
                                <Text style={tailwind('text-lg font-bold text-white text-center')}>logo</Text>
                                </View>
                        )}
                        <TouchableOpacity onPress={() => pickImage(updateBusinessLogo)} style={tailwind('absolute bottom-0 w-28 py-0.5 flex flex-row justify-center rounded-b-xl', {
                            'bg-brand-gray-400': logo !== undefined,
                            'bg-brand-black-500': logo !== undefined
                        })}>
                            <Text style={tailwind('text-white font-semibold text-lg')}>edit</Text>
                        </TouchableOpacity>
                    </View>
                    <ProfileSection sectionName="Account information" onPress={() => setEditProfileState(true)}>
                        <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                            <ControlledTextInputWithLabel
                                editable={editProfileState}
                                label='Business Name'
                                testID='AccountProfile.FirstName.Input'
                                style={{
                                    width: 160
                                }}
                                labelTestId="AccountProfile.FirstName.Label"
                                control={control}
                                name="businessName"
                                rules={{required: {
                                    value: true,
                                    message: "Required"
                                }}}
                            error={errors.businessName !== undefined}
                            errorMessage={errors.businessName?.message}
                            />

                        </View>
                        <ControlledTextInputWithLabel
                                editable={editProfileState}
                                label='Business Email'
                                testID='AccountProfile.LastName.Input'
                                labelTestId="AccountProfile.LastName.Label"
                                control={control}
                                name="businessEmail"
                                rules={{required: {
                                    value: true,
                                    message: "Required"
                                }}}
                            error={errors.businessEmail !== undefined}
                            errorMessage={errors.businessEmail?.message}
                            />
                        <ControlledTextInputWithLabel
                            editable={editProfileState}
                            label='Business Address'
                            testID='AccountProfile.PhoneNumber.Input'
                            labelTestId="AccountProfile.PhoneNumber.Label"
                            containerStyle={tailwind('w-full mt-5')}
                            control={control}
                            name="businessAddress"
                            rules={{required: {
                                value: true,
                                message: "Required"
                            }}}
                        error={errors.businessAddress !== undefined}
                        errorMessage={errors.businessAddress?.message}
                    />
                    </ProfileSection>
                    {editProfileState && (
                        <GenericButton
                        style={tailwind('mt-4')}
                        labelColor={tailwind('text-white')}
                        onPress={handleSubmit(updateProfile)}
                        label="Update profile"
                        backgroundColor={tailwind('bg-primary-500')}
                        testId="Accountprofile.editButton"
                        loading={submitting}
                        />
                    )}

                    <View style={tailwind('my-10 border-brand-gray-700 border-0.5 border-dashed px-3 py-5 rounded')}>
                    <TextWithMoreInfo
                        moreInfo="Amazing image of your signature dish. "
                        text="Add a restaurant image"
                        containerStyle={tailwind('mb-4')}
                    />
                    <ListingsPhotosUploadButton onPress={() => pickImage(updateBusinessImage)} disabled={false}  />
                </View>
                {!editProfileState && (
                    <View  style={tailwind('flex w-full flex-col mt-16')}>
                        <View style={tailwind('flex flex-col w-full')}>
                            <Text style={tailwind('text-lg font-medium text-brand-black-500 mb-2')}>Update Location</Text>
                            <InfoHover  />
                        </View>
                        <GenericButton
                            style={tailwind('my-4')}
                            loading={gettingLocation}
                            onPress={() => void requestLocation() }
                            label={gettingLocation ? RestaurantProfileInteraction.GETTING_LOCATION_MESSAGE : RestaurantProfileInteraction.GET_LOCATION_BTN}
                            labelColor={tailwind('text-white')}
                            backgroundColor={tailwind('bg-brand-black-500')} testId="Loc.Cord" />
                    </View>
                )}
            </ScrolledView>
        </SafeAreaView>
    )
}


function InfoHover (): JSX.Element {
    return (
       <View style={tailwind('flex flex-row justify-between w-full items-center')}>
        <Text style={tailwind('text-xs text-brand-gray-400')}>We use precise location of your restaurant calculate distance and provide ETA to customers</Text>
       </View>
    )
}

