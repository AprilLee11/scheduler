import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export class RxjsUtil {
    static filterOutNullStream(observable: Observable<any>) {
        return observable.pipe(filter((data: any) => data != null));
    };

    static stopSubscribing(subscription: Subscription) {
        if(subscription) {
            subscription.unsubscribe();
        }
    }
}