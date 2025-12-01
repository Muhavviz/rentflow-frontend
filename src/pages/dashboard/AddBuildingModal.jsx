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
    name: Yup.string().required('Building name is required'),
    address: Yup.object({
        street: Yup.string().required('Street is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        pincode: Yup.string().required('Pincode is required')
    })
})

export default function AddBuildingModal({ children, buildingId }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const buildings = useSelector((state) => state.buildings.data);

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
            if (isEditMode) {
                await dispatch(updateBuilding({ id: buildingId, formData: values }));
            } else {
                await dispatch(createBuilding(values));
            }
            resetForm();
            setOpen(false);
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

                    <div className="flex justify-end pt-4">
                        <Button type='submit' disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : (isEditMode ? 'Update Building' : 'Save Building')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}