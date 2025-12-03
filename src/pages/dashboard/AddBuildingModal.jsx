import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import { createBuilding, updateBuilding, clearEditId } from "@/slices/building-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from 'lucide-react';

const buildingSchema = Yup.object({
    name: Yup.string().required('Building name is required').min(4, 'Building name must be at least 4 characters'),
    address: Yup.object({
        street: Yup.string().required('Street is required').min(3, 'Street must be at least 3 characters'),
        city: Yup.string().required('City is required').min(3, 'City must be at least 3 characters'),
        state: Yup.string().required('State is required').min(3, 'State must be at least 3 characters'),
        pincode: Yup.string().required('Pincode is required').min(3, 'Pincode must be at least 3 characters')
    })
})

export default function AddBuildingModal({ children, buildingId }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const buildings = useSelector((state) => state.buildings.data);
    const serverError = useSelector((state) => state.buildings.serverError);

    const editingBuilding = buildingId ? buildings.find(b => b._id === buildingId) : null;
    const isEditMode = !!editingBuilding;

    const formik = useFormik({
        initialValues: {
            name: editingBuilding?.name || '',
            address: {
                street: editingBuilding?.address?.street || '',
                city: editingBuilding?.address?.city || '',
                state: editingBuilding?.address?.state || '',
                pincode: editingBuilding?.address?.pincode || ''
            }
        },
        enableReinitialize: true,
        validationSchema: buildingSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                let result;
                if (isEditMode) {
                    result = await dispatch(updateBuilding({ id: buildingId, formData: values }));
                } else {
                    result = await dispatch(createBuilding(values));
                }
                
                // Only close modal and reset form if the action was successful
                if (result.type.endsWith('/fulfilled')) {
                    resetForm();
                    setOpen(false);
                }
            } catch (error) {
                // Error is handled by Redux, but we keep the modal open
                console.error('Error creating/updating building:', error);
            }
        }
    });

    useEffect(() => {
        if (!open) {
            formik.resetForm();
            if (isEditMode) {
                dispatch(clearEditId());
            }
        }
    }, [open]);

    const isError = (field) => formik.touched[field] && formik.errors[field]
    const isAddressError = (field) => formik.touched.address?.[field] && formik.errors.address?.[field]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? children : (<Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Building
                </Button>)}

            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Building' : 'Add New Building'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? 'Update the details of your property.' : 'Enter the details of your property here.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor='name'>Building Name</Label>
                        <Input name='name' id='name'
                            placeholder='e.g. Burj Khalifa'
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={isError('name') ? "border-red-500" : ""}
                        />
                        {isError('name') && <span className="text-xs text-red-500">{formik.errors.name}</span>}
                    </div>

                    <div className="grid gap-1">
                        <Label>Address</Label>
                        <div className="grid gap-2">
                            <Input
                                name='address.street'
                                placeholder='Street Address'
                                value={formik.values.address.street}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={isAddressError('street') ? 'border-red-500' : ''}
                            />
                            {isAddressError('street') && <span className="text-xs text-red-500">{formik.errors.address.street}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-1">
                                <Input name='address.city'
                                    placeholder='City'
                                    value={formik.values.address.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={isAddressError('city') ? "border-red-500" : ""}
                                />
                                {isAddressError('city') && <span className="text-xs text-red-500">{formik.errors.address.city}</span>}
                            </div>

                            <div className="grid gap-1">
                                <Input
                                    name='address.state'
                                    placeholder='State'
                                    value={formik.values.address.state}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={isAddressError('state') ? "border-red-500" : ""}
                                />
                                {isAddressError('state') && <span className="text-xs text-red-500">{formik.errors.address.state}</span>}
                            </div>
                        </div>

                        <div className="grid gap-1">
                            <Input
                                name='address.pincode'
                                placeholder='Zip / Pincode'
                                value={formik.values.address.pincode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={isAddressError('pincode') ? "border-red-500" : ""}
                            />
                            {isAddressError('pincode') && <span className="text-xs text-red-500">{formik.errors.address.pincode}</span>}
                        </div>
                    </div>

                    {serverError && (
                        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                            {Array.isArray(serverError?.error) ? (
                                <ul className="list-disc list-inside">
                                    {serverError.error.map((err, idx) => (
                                        <li key={idx}>{err.message || err}</li>
                                    ))}
                                </ul>
                            ) : typeof serverError?.error === 'string' ? (
                                serverError.error
                            ) : (
                                'Failed to save building. Please try again.'
                            )}
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button type='submit' disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : (isEditMode ? 'Update Building' : 'Save Building')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    )
}