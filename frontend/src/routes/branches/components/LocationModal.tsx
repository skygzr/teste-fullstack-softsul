import type { FC } from 'react';
import { Fragment, useCallback, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { EyeIcon } from '@heroicons/react/solid';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import type { Branch } from '../../../services/httpService/types';

type Props = {
	item: Branch | null;
	open: boolean;
	setOpen: (open: boolean) => void;
};

const containerStyle = {
	width: '400px',
	height: '400px',
};

const LocationModal: FC<Props> = (props) => {
	const { item, open, setOpen } = props;

	const [mapState, setMapState] = useState<any>(null);

	const center = {
		lat: item?.lat ?? 16.47202632837422,
		lng: item?.lng ?? -54.593890108907516,
	};

	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: 'AIzaSyB05Ieyk7qNn8KWFwOnHEqCbGcYVoI_Kfw',
	});

	const onLoad = useCallback((map: any) => {
		const bounds = new window.google.maps.LatLngBounds(center);
		map.fitBounds(bounds);
		setMapState(map);
	}, []);

	const onUnmount = useCallback(() => {
		setMapState(null);
	}, []);

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed z-10 inset-0 overflow-y-auto">
					<div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-3xl sm:w-full sm:p-6">
								<div>
									<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
										<EyeIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
									</div>
									<div className="mt-3 sm:mt-5">
										<Dialog.Title
											as="h3"
											className="text-lg text-center leading-6 font-medium text-gray-900"
										>
											Localização da filial {item?.name}
										</Dialog.Title>
										<div className="mt-2">
											{isLoaded ? (
												<GoogleMap
													mapContainerStyle={containerStyle}
													center={center}
													zoom={10}
													onLoad={onLoad}
													onUnmount={onUnmount}
												/>
											) : (
												<div className="flex justify-center">
													<div className="spinner" />
												</div>
											)}
										</div>
									</div>
								</div>

								<div className="mt-5">
									<button
										type="button"
										className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:col-start-1 sm:text-sm"
										onClick={() => setOpen(false)}
									>
										Fechar
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default LocationModal;
