import {getColor, tailwind} from "@tailwind";
import {Image, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {ScrolledView} from "@components/views/ScrolledView";
import React, {useEffect, useState} from "react";
import {ProfileSection} from "@screens/AppNavigator/SettingsNavigator/components/ProfileSections";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {useNavigation} from "@react-navigation/native";
import * as Location from 'expo-location'
import * as ImagePicker from "expo-image-picker";
import { RootState, useAppDispatch, useAppSelector } from "@store/index";
import {  showTost } from "@components/commons/Toast";
import { fetchProfile } from "@store/profile.reducer";
import { _api } from "@api/_request";
import * as Device from 'expo-device'
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid'
import { useToast } from "react-native-toast-notifications";
import { TextWithMoreInfo } from "@components/Text/TextWithMoreInfo";
import { ListingsPhotosUploadButton } from "@screens/AppNavigator/ListingsNavigator/screens/components/ListingsPhotosUploadButton";
import LogoPlaceholder from '@assets/app/logo-placeholder.png'
import {LoaderComponent, LoaderComponentScreen} from "@components/commons/LoaderComponent";
import mime from "mime";
import * as FileSystem from 'expo-file-system'
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {StackScreenProps} from "@react-navigation/stack";
import {SettingsParamsList} from "@screens/AppNavigator/SettingsNavigator/SettingsNav";
import {SettingsScreenName} from "@screens/AppNavigator/SettingsNavigator/SettingsScreenName.enum";
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

type RestaurantProfileProps = StackScreenProps<SettingsParamsList, SettingsScreenName.RESTAURANT_PROFILE>
export const RestaurantProfile: React.FC<RestaurantProfileProps> = ({navigation}) => {
    const {hasFetchedProfile, profile } = useAppSelector((state: RootState) => state.profile)
    const dispatch = useAppDispatch()

    const toast = useToast()
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [editProfileState, setEditProfileState] = useState<boolean>(false)
    const [gettingLocation, setGettingLocation] = useState<boolean>(false)
    const [logo, setLogo] = useState<string | undefined>(undefined)
    const [updatingLogo, setUpdatingLogo] = useState<boolean>(false)
    const [updatingImage, setUpdatingImage] = useState<boolean>(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_restaurantImage, _setRestaurantImage] = useState<string | undefined>(undefined)
    const [form, setForm] = useState<RestaurantProfileForm>({
        businessAddress: '',
        businessEmail: '',
        businessName: ''
    })


    useEffect(() => {
        setForm(prev => ({...prev, 'businessName':profile.businessName, businessEmail: profile.businessEmail, businessAddress: profile.businessAddress}))
        setLogo(profile.businessLogo)
        _setRestaurantImage(profile.restaurantImage)

        navigation.setOptions({
            headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />
        })
    }, [])



    if (!hasFetchedProfile) {
        return (
            <LoaderComponentScreen />
        )
    }


    async function updateBusinessLogo (data: ImagePicker.ImagePickerAsset): Promise<void> {
        let uri = ''
        if (Device.osName === 'Android') {
            const path = await FileSystem.getInfoAsync(data.uri)
            console.log(path)
            uri = path.uri
        } else {
            uri = data?.uri.replace('file://', '')
        }

        const type = mime.getType(uri)

        const imagePayload = {
            uri,
            type,
            name: `${uuid.v4()}.${type}`,
        } as any

        const payload = new FormData()
        payload.append('logo', imagePayload)
        try {
            setUpdatingLogo(true)
            const photo = ( await _api.requestData({
                method: 'put',
                url: 'vendor/image/logo',
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*'
                },
                transformRequest: (data: any) => {
                    return data
                },
                data: payload
            })).data
            setLogo(photo)
            showTost(toast, 'Image updated!', 'success')
        } catch (error) {
            showTost(toast, 'failed to upload image', 'error')
        } finally {
            setUpdatingLogo(false)
        }
    }

    async function updateBusinessImage (data: ImagePicker.ImagePickerAsset): Promise<void> {
        let uri = ''
        if (Device.osName === 'Android') {
            const path = await FileSystem.getInfoAsync(data.uri)
            console.log(path)
            uri = path.uri
        } else {
            uri = data?.uri.replace('file://', '')
        }

            const type = mime.getType(uri)

        const imagePayload = {
            uri,
            type,
            name: `${uuid.v4()}.${type}`,
        } as any

        const payload = new FormData()
        payload.append('image', imagePayload)

        try {
            setUpdatingImage(true)
            const photo = ( await _api.requestData({
                method: 'put',
                url: 'vendor/image/restaurant',
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*'
                },
                transformRequest: (data: any) => {
                    return data
                },
                data: payload
            })).data
            _setRestaurantImage(photo)
            showTost(toast, 'Image updated!', 'success')
            dispatch(fetchProfile())
        } catch (error) {
            console.error(error)
            showTost(toast, 'failed to upload image', 'error')
        } finally {
            setUpdatingImage(false)
        }
    }

    async function requestLocation (): Promise<void> {
        setGettingLocation(true)

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
        showTost(toast, RestaurantProfileInteraction.GET_LOCATION_FAILED, 'error')
            setGettingLocation(false)
            return
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
                data: { location: {type: "Point", coordinates: [latitude, longitude]}}
            })
            dispatch(fetchProfile())
        } catch (error) {
            showTost(toast, 'failed to update location', 'error')
        }
    }

   async function updateProfile (): Promise<void> {
    setSubmitting(true)
       try {
         await _api.requestData<RestaurantProfileForm>({
            method: 'put',
            url: 'vendor/profile',
            data: {...form}
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
        try {
            await ImagePicker.requestMediaLibraryPermissionsAsync()
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsMultipleSelection: false,
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4, 3],
                quality: 1,
                selectionLimit: 1,
            });

            if (!result.canceled) {
                await  cb(result?.assets[0])
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
            <ScrolledView testId="AccountProfile.View" style={tailwind('w-full flex-1 px-5 pt-5 bg-white')}>
                    <View style={tailwind('flex flex-row w-full justify-center relative')}>
                        {logo !== undefined ? (
                            <View style={tailwind('rounded-xl w-28 h-28')}>
                                <Image source={{uri: logo}} resizeMode="cover" style={tailwind('rounded-xl w-28 h-28')} />
                            </View>
                        ):  (
                            <View style={tailwind('rounded-xl w-28 h-28')}>
                                <Image source={LogoPlaceholder} resizeMode="cover" style={tailwind('rounded-xl w-28 h-28')} />
                            </View>
                        )}
                        <TouchableOpacity disabled={updatingLogo} onPress={() => pickImage(updateBusinessLogo)} style={tailwind('absolute mt-2 -bottom-0 w-28 py-0.5 bg-brand-gray-400 flex flex-row justify-center', {
                            'bg-brand-black-500': logo !== undefined
                        })}>
                            {updatingLogo ? <LoaderComponent size='small' color={getColor('black')} style={tailwind('pl-2 text-black')} /> : <Text style={tailwind('text-white font-semibold text-lg')}>edit</Text>}
                        </TouchableOpacity>
                    </View>
                    <ProfileSection sectionName="Account information" onPress={() => setEditProfileState(true)}>
                        <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                            <TextInputWithLabel
                                defaultValue={form.businessName}
                                onChangeText={value => setForm(prev => ({...prev, businessName: value}))}
                                editable={editProfileState}
                                label='Business Name'
                                testID='AccountProfile.FirstName.Input'
                                style={{
                                    width: 160
                                }}
                                labelTestId="AccountProfile.FirstName.Label"
                                error={false}
                                 errorMessage="Required"
                            />
                        </View>
                        <TextInputWithLabel
                            editable={editProfileState}
                            label='Business Email'
                            defaultValue={form.businessEmail}
                            onChangeText={value => setForm(prev => ({...prev, businessEmail: value}))}
                            testID='AccountProfile.FirstName.Input'
                            labelTestId="AccountProfile.FirstName.Label"
                            error={false}
                            errorMessage="Required"
                        />
                        <TextInputWithLabel
                            editable={editProfileState}
                            label='Business Address'
                            defaultValue={form.businessAddress}
                            onChangeText={value => setForm(prev => ({...prev, businessAddress: value}))}
                            testID='AccountProfile.FirstName.Input'
                            labelTestId="AccountProfile.FirstName.Label"
                            error={false}
                            errorMessage="Required"
                        />
                    </ProfileSection>
                    {editProfileState && (
                        <GenericButton
                        style={tailwind('mt-4')}
                        labelColor={tailwind('text-white font-medium')}
                        onPress={updateProfile}
                        label="Update profile"
                        backgroundColor={tailwind('bg-brand-black-500')}
                        testId="Accountprofile.editButton"
                        loading={submitting}
                        />
                    )}


                <View style={tailwind('my-10')}>
                    {profile.restaurantImage === undefined && <Text style={tailwind('text-sm mb-1 text-warning-600')}>Missing restaurant banner image</Text>}
                    <View style={tailwind(' border-brand-gray-700 border-0.5 border-dashed px-3 py-5 rounded')}>
                        {_restaurantImage && (
                            <View style={tailwind('rounded-xl w-full')}>
                                <Image source={{uri: _restaurantImage, cache: 'force-cache'}} resizeMode="cover" style={tailwind('rounded-xl w-full h-28')} />
                            </View>
                        )}
                        <TextWithMoreInfo
                            moreInfo="Amazing image of your signature dish. "
                            text={_restaurantImage ? "" : "Add a restaurant image"}
                            containerStyle={tailwind('mb-4')}
                        />
                        <ListingsPhotosUploadButton loading={updatingImage} onPress={() => pickImage(updateBusinessImage)} disabled={updatingImage}  />
                    </View>
                </View>
                {!editProfileState && (
                    <View  style={tailwind('flex w-full flex-col my-16')}>
                        {(profile.location?.coordinates[0] === 0 as any) && <Text style={tailwind('text-sm mb-1 text-warning-600')}>Please update location</Text>}
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
    )
}


function InfoHover (): JSX.Element {
    return (
       <View style={tailwind('flex flex-col justify-between w-full ')}>
        <Text style={tailwind('text-xs text-brand-gray-400')}>We use precise location of your restaurant calculate distance and provide ETA to customers</Text>
        <Text style={tailwind('text-sm font-bold text-brand-gray-400 mt-2')}>Make sure you are at your place of business before updating this</Text>
       </View>
    )
}

