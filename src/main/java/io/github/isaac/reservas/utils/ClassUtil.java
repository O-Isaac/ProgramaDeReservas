package io.github.isaac.reservas.utils;

import org.apache.commons.beanutils.BeanUtilsBean;

import java.lang.reflect.InvocationTargetException;

public class ClassUtil {

    private static final BeanUtilsBean notNull = new BeanUtilsBean() {
        @Override
        public void copyProperty(Object bean, String name, Object value)
                throws IllegalAccessException, InvocationTargetException {
            if (value != null) {
                super.copyProperty(bean, name, value);
            }
        }
    };

    public static void copyNonNullProperties(Object dest, Object orig) {
        try {
            notNull.copyProperties(dest, orig);
        } catch (IllegalAccessException | InvocationTargetException e) {
            System.err.println("Could not copy properties: " + e.getMessage());
        }
    }
}
