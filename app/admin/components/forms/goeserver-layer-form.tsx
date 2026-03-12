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
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { geoserverMapLayers, layerSourceEnum } from '@/lib/db/schema/geoserver'
import { createInsertSchema } from 'drizzle-orm/zod'
import { Controller, useForm } from 'react-hook-form'
import {
  UpsertGeoserverLayer,
  updateGeoServerLayer,
  insertGeoServerLayer,
} from '../../actions/geoserver-map'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Spinner } from '@/components/ui/spinner'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface GeoserverLayerFormProps {
  data?: Partial<UpsertGeoserverLayer>
  children?: React.ReactNode
}

export function GeoserverLayerForm({
  data = {
    geoserverMapId: '' as unknown as number,
    layerId: '',
    source: 'geoserver-tile',
    name: '',
    type: 'nodes',
  },
  children,
}: GeoserverLayerFormProps) {
  const label = 'id' in data && data.id ? 'Edit' : 'Add'

  const formSchema = createInsertSchema(geoserverMapLayers, {
    geoserverMapId: z.coerce.number<number>().int().positive(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  })

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    if ('id' in data && data.id) {
      await updateGeoServerLayer(data.id, formData)
    } else {
      await insertGeoServerLayer(formData)
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
            <AlertDialogTitle>{label} map layer</AlertDialogTitle>
            <AlertDialogDescription>
              Make changes to the map layer metadata.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <FieldGroup>
            <Controller
              name="geoserverMapId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.invalid}>
                  <FieldLabel htmlFor="geoserver-layer-form-geoserverMapId">
                    GeoServer Map ID
                  </FieldLabel>
                  <Input
                    disabled
                    id="geoserver-layer-form-geoserverMapId"
                    type="number"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />

            <Controller
              name="source"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={!!fieldState.invalid}>
                  <FieldLegend>Source</FieldLegend>

                  <RadioGroup
                    id="geoserver-layer-form-source"
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    className="grid grid-cols-2 gap-4"
                  >
                    {layerSourceEnum.enumValues.map((source) => (
                      <Field key={source} orientation="horizontal">
                        <RadioGroupItem
                          value={source}
                          id={`source-${source}`}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldLabel htmlFor={`source-${source}`}>
                          {source}
                        </FieldLabel>
                      </Field>
                    ))}
                  </RadioGroup>
                </FieldSet>
              )}
            />

            <Controller
              name="layerId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="geoserver-layer-form-layerId">
                    Layer ID
                  </FieldLabel>
                  <Input
                    id="geoserver-layer-form-layerId"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.invalid}>
                  <FieldLabel htmlFor="geoserver-layer-form-name">
                    Name
                  </FieldLabel>
                  <Input
                    id="geoserver-layer-form-name"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />

            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={!!fieldState.invalid}>
                  <FieldLegend>Type</FieldLegend>

                  <RadioGroup
                    id="geoserver-layer-form-type"
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    className="grid grid-cols-2 gap-4"
                  >
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <RadioGroupItem
                        value="nodes"
                        id="type-nodes"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor="type-nodes">Nodes</FieldLabel>
                    </Field>

                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <RadioGroupItem
                        value="edges"
                        id="type-edges"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor="type-edges">Edges</FieldLabel>
                    </Field>
                  </RadioGroup>
                </FieldSet>
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
