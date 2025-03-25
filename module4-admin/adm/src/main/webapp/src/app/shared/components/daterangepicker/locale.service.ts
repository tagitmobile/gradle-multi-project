import { Injectable, Inject } from '@angular/core';
import { LOCALE_CONFIG, DefaultLocaleConfig, LocaleConfig } from './daterangepicker.config';

@Injectable()
export class LocaleService {
    constructor(@Inject(LOCALE_CONFIG) private LocConfig: LocaleConfig) {}

    get config(): any {
        if (!this.LocConfig) {
            return DefaultLocaleConfig;
        }

        return { ...DefaultLocaleConfig, ...this.LocConfig };
    }
}
