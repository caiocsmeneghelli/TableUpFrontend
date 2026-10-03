import { Directive, ElementRef, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const MAX_DIGITS = 11;
const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Máscara de moeda (R$ 1.234,56): o input mostra o valor formatado e o ngModel recebe o número
@Directive({
  selector: 'input[appCurrencyMask]',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CurrencyMask), multi: true }],
})
export class CurrencyMask implements ControlValueAccessor {
  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input')
  onInput() {
    const digits = this.el.nativeElement.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, MAX_DIGITS);
    const value = digits ? Number(digits) / 100 : null;
    this.render(value);
    this.onChange(value);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  writeValue(value: number | null): void {
    this.render(value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  private render(value: number | null) {
    this.el.nativeElement.value = value === null || value === undefined ? '' : formatter.format(value);
  }
}
