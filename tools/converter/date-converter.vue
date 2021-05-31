<template>
  <ToolWrapper :config="$toolConfig">
    <v-row>
      <v-col md="3" sm="12" class="pt-0 pb-0">
        <div class="text-center">
          <v-switch v-model="useCurrentDate" label="Use current date" />
        </div>
      </v-col>

      <v-col md="3" sm="12" class="pt-0 pb-0">
        <v-select
          v-model="inputFormatterTitle"
          :items="formats.filter(f => !f.title.toLowerCase().includes('locale')).map(v => v.title)"
          outlined
          label="Your date format"
          placeholder="Input format"
          :disabled="useCurrentDate"
          @input="userInputChanged()"
        />
      </v-col>
      <v-col md="6" sm="12" class="pt-0 pb-0">
        <v-text-field
          v-model="inputString"
          outlined
          label="Your date string"
          :error="invalidInput"
          :disabled="useCurrentDate"
          @input="userInputChanged()"
        />
      </v-col>
    </v-row>

    <br>
    <v-divider />
    <br>
    <br>

    <v-text-field
      v-for="format of formats"
      :key="format.title"
      dense
      readonly
      outlined
      :label="format.title"
      :value="format.getDate(displayedDate)"
      append-icon="mdi-content-copy"
      @click:append="copy(format.getDate(displayedDate))"
    />
  </ToolWrapper>
</template>

<tool>
title: 'Date/Time converter'
description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.'
icon: 'mdi-calendar-range'
keywords: ['date', 'time', 'converter', 'iso']
path: '/date-converter'
</tool>

<script lang="ts">

import {Component} from 'nuxt-property-decorator'
import {CopyableMixin} from '@/mixins/copyable.mixin'
import Tool from '@/components/Tool.vue'

@Component({
  mixins: [CopyableMixin]
})
export default class DateConverter extends Tool {
  inputString = ''
  inputFormatterTitle: string | null = null
  useCurrentDate = true
  displayedDate = new Date()
  invalidInput = false
  formats = [
    {
      title: 'Locale datetime',
      getDate: (displayedDate: Date) => displayedDate.toLocaleString(),
      dateFromFormat: (dateString: string) => dateString
    },
    {
      title: 'ISO 8601',
      getDate: (displayedDate: Date) => displayedDate.toISOString(),
      dateFromFormat: (dateString: string) => new Date(dateString)
    },
    {
      title: 'UTC format',
      getDate: (displayedDate: Date) => displayedDate.toUTCString(),
      dateFromFormat: (dateString: string) => new Date(dateString)
    },
    {
      title: 'UNIX Timestamp (ms)',
      getDate: (displayedDate: Date) => displayedDate.getTime(),
      dateFromFormat: (dateString: string) => new Date(parseInt(dateString))
    },
    {
      title: 'Complete',
      getDate: (displayedDate: Date) => displayedDate.toString(),
      dateFromFormat: (dateString: string) => new Date(dateString)
    }
  ]

  refreshCurrentDate() {
    if (this.useCurrentDate) {
      this.displayedDate = new Date()
    }
  }

  userInputChanged() {
    try {
      this.invalidInput = false
      const newDate = this.formats.find(f => f.title === this.inputFormatterTitle)?.dateFromFormat(this.inputString)
      if (newDate && !isNaN((newDate as Date).getTime())) {
        this.useCurrentDate = false
        this.displayedDate = newDate as Date
      } else if (this.inputString.length > 0) {
        this.invalidInput = true
      }
    } catch (ignored) {
      //
    }
  }

  created() {
    setInterval(this.refreshCurrentDate.bind(this), 1000)
    this.inputFormatterTitle = this.formats[1].title
  }
}

</script>
