We know the points of our triangle, but we need lines between them. We iterate through the list of points. The tricky bit is treating the first point as the next point when we reach the last point.

If you haven't seen the **? :** syntax before, it's a one-line *if* statement called the *ternary operator*. `myvar ? true : false;` is the same as writing:

```javascript
if (myvar) {
  return true
} else 
  return false
}
```
