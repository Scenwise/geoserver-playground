'use client'

import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { geoserverMaps } from '@/lib/db/schema'
import { createInsertSchema } from 'drizzle-orm/zod'
import { Controller, useForm } from 'react-hook-form'
import {
  UpsertGeoserverMap,
  updateGeoServerMap,
  insertGeoServerMap,
} from '../actions/geoserver-map'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Spinner } from '@/components/ui/spinner'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'

interface GeoserverMapFormProps {
  data?: UpsertGeoserverMap
  children?: React.ReactNode
}

export function GeoserverMapForm({
  data = {
    name: '',
    version: '' as unknown as number,
    description: '',
    geoserverEdges: '',
    geoserverNodes: '',
  },
  children,
}: GeoserverMapFormProps) {
  const label = 'id' in data && data.id ? 'Edit' : 'Add'

  const formSchema = createInsertSchema(geoserverMaps, {
    version: z.coerce.number<number>().int().positive(),
    description: z.string().optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...data, description: data.description ?? '' },
  })

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    if ('id' in data && data.id) {
      await updateGeoServerMap(data.id, formData)
    } else {
      await insertGeoServerMap(formData)
    }

    setIsOpen(false)
  }

  const [isOpen, setIsOpen] = useState(false)

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <AlertDialogTrigger asChild>
          {children || <Button variant="default">{label}</Button>}
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{label} map</AlertDialogTitle>
            <AlertDialogDescription>
              Make changes to your map here. Click save when you&apos;re done.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.invalid}>
                  <FieldLabel htmlFor="geoserver-map-form-name">
                    Name
                  </FieldLabel>
                  <Input
                    id="geoserver-map-form-name"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />

            <Controller
              name="version"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.invalid}>
                  <FieldLabel htmlFor="geoserver-map-form-version">
                    Version number
                  </FieldLabel>
                  <Input
                    id="geoserver-map-form-version"
                    type="number"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="geoserver-map-form-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="geoserver-map-form-description"
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />

            <Controller
              name="geoserverEdges"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.invalid}>
                  <FieldLabel htmlFor="geoserver-map-form-edges">
                    Geoserver edges
                  </FieldLabel>
                  <Input
                    id="geoserver-map-form-edges"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />

            <Controller
              name="geoserverNodes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.invalid}>
                  <FieldLabel htmlFor="geoserver-map-form-nodes">
                    Geoserver nodes
                  </FieldLabel>
                  <Input
                    id="geoserver-map-form-nodes"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />
          </FieldGroup>

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <Button
              type="submit"
              onClick={() =>
                form.handleSubmit(onSubmit, (errors) =>
                  console.log('Form errors:', errors),
                )()
              }
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Spinner />
                  Saving
                </>
              ) : (
                'Save'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </AlertDialog>
  )
}
